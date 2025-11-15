from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    # Chạy trên cổng 5000, debug=True để dễ phát triển trong VS Code
    app.run(debug=True, host="127.0.0.1", port=5000)
