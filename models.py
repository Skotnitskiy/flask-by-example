from app import db


class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String())
    description = db.Column(db.Text)

    def __init__(self, title, description):
        self.title = title
        self.description = description

        def __repr__(self):
            return '<Post %r>' % self.title
