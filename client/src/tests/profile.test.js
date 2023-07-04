import { render, unmountComponentAtNode  } from 'react-dom';
import { act } from "react-dom/test-utils";
import UserPage from '../pages/UserPage';

let container = null;

let profile = {
    country: "US",
    display_name: "statify",
    email: "statifytest@gmail.com",
    generatedShareLink: "http://localhost:8400/premium/sharing/VbXqvHkWfxvMSNor",
    id: "31oadqabwvmlmape6n5uyccvqgcm",
    isPremium: false,
    product: "free",
    profile_img: null,
}

beforeEach(() => {
sessionStorage.setItem('userProfile', JSON.stringify(profile));
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


test("Get profile page", async () => {
    act(() => {
        render(<UserPage/>, container);
    });
    expect(container).toMatchSnapshot()
})