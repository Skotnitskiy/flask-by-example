from flask import Flask, request, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from flask import render_template

app = Flask(__name__)
app.config.from_object("config.DevelopmentConfig")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

import models


@app.route('/view', methods=['GET'])
def view():
    posts = models.Post.query.all()
    return render_template('index.html', posts=posts)


@app.route('/new', methods=['POST'])
def post():
    title = None
    description = None
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        post = models.Post(title, description)
        db.session.add(post)
        db.session.commit()
    return redirect(url_for('view'))


@app.route('/edit', methods=['POST'])
def edit():
    id = None
    post = None
    if request.method == 'POST':
        id = request.form['id']
        post = models.Post.query.get(id)
        post.title = request.form['title']
        post.description = request.form['description']
        db.session.query(models.Post).filter(models.Post.id == id).update(post)
        db.session.commit()
    return redirect(url_for('view'))


@app.route('/delete', methods=['DELETE', 'POST'])
def delete():
    id_post = None
    post = None
    if request.method == 'DELETE' or request.method == 'POST':
        id_post = request.form['id']
        # post = models.Post.query.get(id_post)
        # db.session.delete(post)
        models.Post.query.filter_by(id=id_post).delete()
        db.session.commit()
    return redirect(url_for('view'))


if __name__ == '__main__':
    app.run()