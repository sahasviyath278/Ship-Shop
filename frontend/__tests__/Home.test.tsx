import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home page", () => {
    it("renders welcome heading", () => {
        render(<Home />);
        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
});