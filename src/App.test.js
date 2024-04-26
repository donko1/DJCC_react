import { render, screen } from "@testing-library/react";
import App from "./App.js";

describe("App", () => {
  it("renders the Main component", () => {
    render(<App />);
    const mainComponent = screen.getByText(
      "Привет! Это сайт по рисованию свечных графиков онлайн!"
    );
    expect(mainComponent).toBeInTheDocument();
  });
});
