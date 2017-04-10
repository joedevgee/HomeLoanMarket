from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/size')
def getSize():
    print('Getting size')
    return 'This is the size'

if __name__=='__main__':
    app.run()