import NComponent from "../core/core.js";
import "./app.scss";

export default class App extends NComponent {
  init() {
    this.useState({
      count: 0,
      text: ""
    });
  }

  increment() {
    this.setState({
      count: this.state.count + 1
    })
    this.setState({
      text: '리-렌더'
    })
  }

  decrement() {
    this.setState({
      count: this.state.count - 1
    })
  }

  handleInputChange(event) {
    this.state.text = event.target.value;
  }

  jsxRender() {
    console.log('리-렌더링', this.state)
    return `
      <div id="root">
          <div class="textbox">
            <label for="custom_imput"></label>
            <input type="text" id="custom_imput" onChange="handleInputChange" />
          </div>

        <span class="text-area">${this.state.text}</span>
        <div class="count">count = ${this.state.count}</div>

        <div class="button-list">
          <button onClick="increment">Button</button>
          <button onClick="decrement" class="decrement dark">Decrement</button>
        </div>
      </div>
      `;
  }
}
