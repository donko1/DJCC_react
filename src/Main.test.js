import { render, screen } from "@testing-library/react";
import Main from "./main.js";

describe("Main", () => {
  it("renders a welcome message", () => {
    render(<Main />);
    const welcomeMessage = screen.getByText(
      "Привет! Это сайт по рисованию свечных графиков онлайн!"
    );
    expect(welcomeMessage).toBeInTheDocument();
  });

  it("renders instructions", () => {
    render(<Main />);
    const instructions = screen.getByText(
      "Для использования напиши в форму ниже значения"
    );
    expect(instructions).toBeInTheDocument();
  });
});
