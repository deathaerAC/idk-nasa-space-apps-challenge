from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/moon")
def moon():
    return render_template("moon.html")

@app.route("/earth")
def earth():
    return render_template("earth.html")

@app.route("/mars")
def mars():
    return render_template("mars.html")

@app.route("/analog_sites")
def analog_sites():
    return render_template("analog_sites.html")

@app.route("/data")
def data():
    return render_template("data.html")

if __name__ == "__main__":
    app.run(debug=True)