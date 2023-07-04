import Favorite from '../components/Favorite';
import { render, unmountComponentAtNode  } from 'react-dom';
import Item from '../components/Item';
import { act } from "react-dom/test-utils";

let container = null;
let loading = [];

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render top 5 songs", () => {
  for (let index = 0; index < 5; index++) {
    loading.push({
      loading: true
    });
  }

  act(() => {
    render(<Favorite type="Songs" ranks={loading}/>, container);
  });

  expect(container).toMatchSnapshot(); /* ... gets filled automatically by jest ... */

});