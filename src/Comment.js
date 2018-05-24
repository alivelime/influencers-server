
class Comment extends React.Component {
	render() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span>{this.props.text}</span>
			</div>
		);
	}
}

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
		this.state = {data: []};
		this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
  }

	loadCommentsFromServer () {
		fetch(new Request('/api/comments'))
		.then((response) => {
				return response.json();
		}, (err) => {console.log(err);})
		.then((res) => {
			console.log(res);
			this.setState({data: res});
		});
	}

  handleCommentSubmit(comment) {
    comment.id = Date.now();

    let comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		fetch(new Request('/api/comments'), { method: 'POST',
               headers: myHeaders,
							 body: JSON.stringify(comment),
               mode: 'cors',
               cache: 'default' })
			.then((response) => {
					return response.json();
			}, (err) => {console.log(err);})
			.then((res) => {
					console.log(res);
			});
  }
	componentDidMount() {
    this.loadCommentsFromServer();
	}

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
}

class CommentList extends React.Component {
	render() {
    let commentNodes = this.props.data.map((comment) => {
      return (
        <Comment author={comment.author} key={comment.id} text={comment.text} />
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
	}
}

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleTextChange(e) {
    this.setState({text: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onCommentSubmit({text: text});
    this.setState({text: ''});
  }
	render() {
	   return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
	}
}

