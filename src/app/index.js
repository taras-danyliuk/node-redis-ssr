import React, { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ""
    };
  }

  _search(event) {
    event.preventDefault();

    const a = "comuter";
    window.location.href = `${window.location.origin}/search?query=${
      this.state.query
    }`;
  }

  _onChange(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    const { categoriesAmount, imagesAmount, title, pageId } = this.props;

    let content = null;
    if (title) {
      content = (
        <div>
          <h1 style={{ textAlign: "center" }}>
            This is result page for {title}
          </h1>

          <h2>Wiki page (page id - {pageId}) contains:</h2>

          <h3>{categoriesAmount} categories</h3>
          <h3>{imagesAmount} images</h3>
        </div>
      );
    }

    return (
      <div>
        <form style={{ textAlign: "center" }} onSubmit={this._search.bind(this)}>
          <input onChange={this._onChange.bind(this)} />
        </form>

        {content}
      </div>
    );
  }
}
