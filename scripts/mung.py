# Import required librabries
import pandas as pd
import json

class DataSource(object):
    def __init__(self, loans_csv, institutions_csv):
        self.loans_file = loans_csv
        self.institutions_file = institutions_csv

    def hmda_init(self):
        # Read data from csv files
        # Because the large volume of the data sets
        # Specify data type can improve memory usage
        dtype = {
            'As_of_Year': int,
            'Agency_Code': int,
            'Agency_Code_Description': str,
            'Respondent_ID': str,
            'Sequence_Number': int,
            'Loan_Amount_000': int,
            'Applicant_Income_000': float,
            'Loan_Purpose_Description': str,
            'Loan_Type_Description': str,
            'Lien_Status_Description': str,
            'State_Code': int,
            'State': str,
            'County_Code': int,
            'MSA_MD': str,
            'MSA_MD_Description': str,
            'Census_Tract_Number': str,
            'FFIEC_Median_Family_Income': int,
            'Tract_to_MSA_MD_Income_Pct': float,
            'Number_of_Owner_Occupied_Units': int,
            'County_Name': str,
            'Conforming_Limit_000': int,
            'Conventional_Status': str,
            'Conforming_Status': str,
            'Conventional_Conforming_Flag': bool
        }
        # To deal with missing values in integer and float fields
        # Because of limitation of Pandas, columns containing null values can only be float   
        def make_float(text):
            try:
                return float(text)
            except ValueError:
                return None
            
        # Convert Conventional_conforming_flag to boolean
        def make_bool(text):
            if text == 'Y':
                return True
            else:
                return False

        converters = {
            'Applicant_Income_000': make_float,
            'County_Code': make_float,
            'FFIEC_Median_Family_Income': make_float,
            'Tract_to_MSA_MD_Income_Pct': make_float,
            'Number_of_Owner_Occupied_Units': make_float,
            'Conforming_Limit_000': make_float,
            'Conventional_Conforming_Flag': make_bool
        }
        df = (pd.read_csv(self.loans_file,dtype=dtype, converters=converters)
                .pipe(self.merge_with_institutions)
                .pipe(self.group_loan_amount)
                .pipe(self.group_income_amount)
                .pipe(self.quality_report))
        return df

    def merge_with_institutions(self, df):
        # Read institutions data from csv file
        institutions_df = pd.read_csv(self.institutions_file,usecols=['Agency_Code','Respondent_ID','Respondent_Name_TS'])
        # Clean the duplicated institutions
        dedup_ins_df = institutions_df.drop_duplicates(subset=['Agency_Code','Respondent_ID'])
        # Merge two dataframes with respondent names added
        return pd.merge(df,dedup_ins_df,how='left',on=['Agency_Code','Respondent_ID'])

    def group_loan_amount(self, df):
        # Loan amount varies based on the loan purpose
        # Here I will group loan amount into three quantiles based on the loan purpose, i.e. purchase or refinance
        df['Loan_Amount_Groupby_Purpose'] = df.groupby(['Loan_Purpose_Description'])['Loan_Amount_000'].transform(lambda x: pd.qcut(x, 3, labels=range(1,4)))
        # The final group will be [1,2,3] responding to ['Small','Medium','Large']
        return df
    
    def group_income_amount(self, df):
        # Here we group applicant income into three quantiles based on the metro areas they belong to
        df['Income_Group'] = df.groupby(['MSA_MD_Description'])['Applicant_Income_000'].transform(lambda x: pd.qcut(x,3,labels=range(1,4)))
        return df

    def hmda_to_json(self, data, states=None, conventional_conforming=None):
        """
        :param states: list of states
        :param conventional_conforming: Boolean True, False or None(select all without filtering)
        :return: True if export succeed
        """
        try:
            if states != None:
                data = data[data.State.isin(states)]
            elif conventional_conforming != None:
                data = data[data['Conventional_Conforming_Flag']==conventional_conforming]
            data.to_json('output.json', orient='records')
        except:
            raise Exception("Cannot export to json")
        return True

    # Perform quality analysis
    def quality_report(self, df):
        # Get all the columns from the data frame
        columns = pd.DataFrame(list(df.columns.values))
        # Get the data types
        data_types = pd.DataFrame(df.dtypes,columns=['Data Type'])
        # Get the number of missing data
        missing_data_counts = pd.DataFrame(df.isnull().sum(),columns=['Missing Values'])
        # Get the number of present values
        present_data_counts = pd.DataFrame(df.count(),columns=['Present Values'])
        # Get the number of unique values
        unique_value_counts = pd.DataFrame(columns=['Unique Values'])
        for v in list(df.columns.values):
            unique_value_counts.loc[v] = [df[v].nunique()]
        # Get the minimum values
        minimum_values = pd.DataFrame(columns=['Minimum Values'])
        for v in ['Applicant_Income_000','FFIEC_Median_Family_Income','Loan_Amount_000','Number_of_Owner_Occupied_Units','Tract_to_MSA_MD_Income_Pct','Conforming_Limit_000']:
            minimum_values.loc[v] = [df[v].min()]
        # Get the maximum values
        maximum_values = pd.DataFrame(columns=['Maximum Values'])
        for v in ['Applicant_Income_000','FFIEC_Median_Family_Income','Loan_Amount_000','Number_of_Owner_Occupied_Units','Tract_to_MSA_MD_Income_Pct','Conforming_Limit_000']:
            maximum_values.loc[v] = [df[v].max()]
        # Merge all of them together
        data_quality_report = data_types.join(present_data_counts).join(missing_data_counts).join(unique_value_counts).join(minimum_values).join(maximum_values)
        # Print out the report
        print('Data Quality Report')
        print('Total records:{}'.format(len(df.index)))
        self.quality = data_quality_report
        return df