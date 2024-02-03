import Component from "../core/core";
import '../pages/app.scss'

export default class TextAreaComponent extends Component {
  jsxRender() {
    return `
      <div>
        <div class="text-area"> ${this.props.userInput}</div>
        <div class="count">Count = ${this.props.userCount}</div>
      </div>
        `;
  }
}
