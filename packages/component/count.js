import NComponent from "../core/core";

export default class CountComponent extends NComponent {

    jsxRender() {
        return `
        <div class="button-list">
            <button onClick="this.props.increment">Button</button>
            <button onClick="this.props.decrement" class="decrement dark">Decrement</button>
        </div>
        `
    }
}