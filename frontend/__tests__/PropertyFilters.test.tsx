import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PropertyFilters from "../components/PropertyFilters";
import { PropertyFilter } from "../types";

const mockOnFilterChange = jest.fn();
const mockOnReset = jest.fn();

const defaultProps = {
  filters: {} as PropertyFilter,
  onFilterChange: mockOnFilterChange,
  onReset: mockOnReset,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PropertyFilters", () => {
  it("renders filter button", () => {
    render(<PropertyFilters {...defaultProps} />);

    expect(screen.getByText("Filter Properties")).toBeInTheDocument();
  });

  it("opens modal when filter button is clicked", async () => {
    render(<PropertyFilters {...defaultProps} />);

    const filterButton = screen.getByText("Filter Properties");
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search by name...")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search by location...")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("$0")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("$999,999,999")).toBeInTheDocument();
    });
  });

  it("displays current filter values in modal", async () => {
    const filters: PropertyFilter = {
      name: "Test Property",
      address: "Test Address",
      minPrice: 100000,
      maxPrice: 500000,
      year: 2020,
    };

    render(<PropertyFilters {...defaultProps} filters={filters} />);

    const filterButton = screen.getByText("Filter Properties");
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Property")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Address")).toBeInTheDocument();
      expect(screen.getByDisplayValue("100000")).toBeInTheDocument();
      expect(screen.getByDisplayValue("500000")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2020")).toBeInTheDocument();
    });
  });

  it("calls onFilterChange when filters are applied", async () => {
    render(<PropertyFilters {...defaultProps} />);

    // Open modal
    const filterButton = screen.getByText("Filter Properties");
    fireEvent.click(filterButton);

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Search by name...");
      fireEvent.change(nameInput, { target: { value: "New Property" } });

      const applyButton = screen.getByText("Apply Filters");
      fireEvent.click(applyButton);
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ name: "New Property" });
  });

  it("calls onReset when reset button is clicked", async () => {
    const filters: PropertyFilter = { name: "Test" };
    render(<PropertyFilters {...defaultProps} filters={filters} />);

    // Open modal
    const filterButton = screen.getByText("Filter Properties");
    fireEvent.click(filterButton);

    await waitFor(() => {
      const resetButton = screen.getByText("Clear All");
      fireEvent.click(resetButton);
    });

    expect(mockOnReset).toHaveBeenCalled();
  });

  it("shows active filter count", () => {
    const filters: PropertyFilter = { name: "Test", minPrice: 100000 };
    render(<PropertyFilters {...defaultProps} filters={filters} />);

    // Should show count badge
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("handles numeric inputs correctly", async () => {
    render(<PropertyFilters {...defaultProps} />);

    // Open modal
    const filterButton = screen.getByText("Filter Properties");
    fireEvent.click(filterButton);

    await waitFor(() => {
      const minPriceInput = screen.getByPlaceholderText("$0");
      fireEvent.change(minPriceInput, { target: { value: "250000" } });

      const applyButton = screen.getByText("Apply Filters");
      fireEvent.click(applyButton);
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ minPrice: 250000 });
  });

  it("handles empty numeric inputs", async () => {
    const filters: PropertyFilter = { minPrice: 100000 };
    render(<PropertyFilters {...defaultProps} filters={filters} />);

    // Open modal
    const filterButton = screen.getByText("Filter Properties");
    fireEvent.click(filterButton);

    await waitFor(() => {
      const minPriceInput = screen.getByDisplayValue("100000");
      fireEvent.change(minPriceInput, { target: { value: "" } });

      const applyButton = screen.getByText("Apply Filters");
      fireEvent.click(applyButton);
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });
});
