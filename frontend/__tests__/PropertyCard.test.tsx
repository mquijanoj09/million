import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PropertyCard from "../components/PropertyCard";
import { Property } from "../types";

const mockProperty: Property = {
  id: 1,
  name: "Test Property",
  address: "123 Test Street, Test City, Test State",
  price: 250000,
  year: 2020,
  codeInternal: "TEST001",
  photo: "https://example.com/photo.jpg",
  idOwner: 1,
  owner: {
    id: 1,
    name: "John Doe",
    address: "Owner Address",
    photo: "owner-photo.jpg",
    birthday: "1980-01-01",
  },
};

describe("PropertyCard", () => {
  it("renders property information correctly", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText("Test Property")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText("$250,000")).toBeInTheDocument();
    // Use regular expression to match "Built 2020" text that's split across elements
    expect(screen.getByText(/Built\s*2020/)).toBeInTheDocument();
    expect(screen.getByText(/Owner:\s*John Doe/)).toBeInTheDocument();
  });

  it("renders default image when no photo provided", () => {
    const propertyWithoutPhoto = { ...mockProperty, photo: undefined };
    render(<PropertyCard property={propertyWithoutPhoto} />);

    // Should render SVG icon instead of image - check that property still renders
    expect(screen.getByText("Test Property")).toBeInTheDocument();
    // Verify no img element exists
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("displays owner information when available", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText(/Owner:\s*John Doe/)).toBeInTheDocument();
  });

  it("handles property without owner gracefully", () => {
    const propertyWithoutOwner = { ...mockProperty, owner: undefined };
    render(<PropertyCard property={propertyWithoutOwner} />);

    expect(screen.queryByText(/Owner:/)).not.toBeInTheDocument();
  });

  it("formats price correctly", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText("$250,000")).toBeInTheDocument();
  });

  it("displays internal code", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText("TEST001")).toBeInTheDocument();
  });

  it("renders as a link to property details", () => {
    render(<PropertyCard property={mockProperty} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/properties/1");
  });
});
