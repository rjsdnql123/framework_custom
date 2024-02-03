import NComponent from "../core/core.js";
import "./app.scss";
import CountComponent from "../component/count.js";
import TextAreaComponent from "../component/resultText.js";
export default class App extends NComponent {
  init() {
    this.$components = {
      'count-component' : CountComponent,
      'text-area-component': TextAreaComponent
    }
    this.useState({
      userCount: 1,
      userInput: ""
    });
  }

  increment() {
    this.state.userCount += 1;
  }

  decrement() {
    this.state.userCount -= 1;
  }

  handleInputChange(event) {
    this.state.userInput = event.target.value;
  }

  jsxRender() {
    console.log(this.state)
    return `
      <div id="root">
          <div class="textbox">
            <label for="custom_imput"></label>
            <input type="text" id="custom_imput" onChange="this.handleInputChange" />
          </div>
          <text-area-component user-input="this.state.userInput" user-count="this.state.userCount"></text-area-component>
          <count-component increment="this.increment" decrement="this.decrement"></count-component>
      </div>
      `;
  }
}
