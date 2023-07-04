import { render, unmountComponentAtNode  } from 'react-dom';
import Item from '../components/Item';
import { act } from "react-dom/test-utils";
import AllPage from '../pages/AllPage';

const request = require("supertest");

// Container is where the component will be rendered in
let container = null;


let access_token = "BQA3e0AWRzRY2prW9PJtTMndcMBRPFyPV9VIHbv64l-jA2imxaW8BXlnLxtGP9pu1xDAtEK8e43nDKfyTN2h18-XIX1kFgF_rcmlbuopZxO6KQb3Xb97YijCf890yCQiJ8yLWvlWFoOcTcrGe2YJqgvzZmqqhJqlt1se_TSl0Mk";
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
  // setup a DOM element as a render target
  localStorage.setItem('access_token', access_token);
  sessionStorage.setItem('userProfile', JSON.stringify(profile));
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Should get all data for artists", async () => {
    act(() => {
        render(<AllPage type='artists'/>, container);
    });
    expect(container).toMatchSnapshot()
});

it("Should get all data for genres", async() => {
    act(() => {
        render(<AllPage type='genres'/>, container);
    });
    expect(container).toMatchSnapshot()
});