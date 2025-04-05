import { useState } from "react";
import { FilterOptions } from "../types/interfaces";
import "./FilterBar.css";

interface FilterBarProps {
    onFilterChange: (filters: FilterOptions) => void;
  }
  
  const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
    const [filters, setFilters] = useState<FilterOptions>({
      status: '',
      dueBefore: '',
      tag: '',
      sortBy: 'dueDate',
      order: 'asc'
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = e.target;
      const updatedFilters = {
        ...filters,
        [name]: value
      };
      
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    };
  
    const handleClear = (): void => {
      const clearedFilters = {
        status: '',
        dueBefore: '',
        tag: '',
        sortBy: 'dueDate',
        order: 'asc'
      };
      
      setFilters(clearedFilters);
      onFilterChange(clearedFilters);
    };
  
    return (
      <div className="filter-bar">
        <div className="filter-group">
          <label>Status</label>
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Due Before</label>
          <input
            type="date"
            name="dueBefore"
            value={filters.dueBefore}
            onChange={handleChange}
          />
        </div>
        
        <div className="filter-group">
          <label>Tag</label>
          <input
            type="text"
            name="tag"
            value={filters.tag}
            onChange={handleChange}
            placeholder="Filter by tag"
          />
        </div>
        
        <div className="filter-group">
          <label>Sort By</label>
          <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Creation Date</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Order</label>
          <select name="order" value={filters.order} onChange={handleChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        
        <button className="btn-clear" onClick={handleClear}>Clear Filters</button>
      </div>
    );
  };
  
  export default FilterBar;