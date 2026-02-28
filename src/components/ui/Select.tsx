"use client";

import { forwardRef, useState, useEffect, useRef } from "react";
import { cn } from "@/lib";
import { Text } from "./Text";
import { ChevronDownIcon } from "@/icon";
import styles from "./Select.module.scss";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  selectClassName?: string;
  onChange?: (e: { target: { value: string } }) => void;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      selectClassName,
      label,
      error,
      options,
      value,
      onChange,
      id: idProp,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const id = idProp ?? props.name ?? `select-${Math.random().toString(36).slice(2)}`;
    
    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      onChange?.({ target: { value: optionValue } });
      setIsOpen(false);
    };

    return (
      <div className={cn(styles.root, className)}>
        {label && (
          <Text
            variant="LABEL.MEDIUM"
            as="label"
            htmlFor={id}
            className={styles.label}
          >
            {label}
          </Text>
        )}
        <div className={styles.selectWrapper} ref={dropdownRef}>
          <button
            type="button"
            id={id}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              styles.selectButton,
              error && styles.selectError,
              disabled && styles.selectDisabled,
              selectClassName
            )}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          >
            <span className={styles.selectValue}>{selectedOption?.label || ""}</span>
            <ChevronDownIcon
              className={cn(
                styles.selectChevron,
                isOpen && styles.selectChevronOpen
              )}
            />
          </button>
          {isOpen && (
            <div className={styles.dropdown} role="listbox">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    styles.dropdownItem,
                    option.value === value && styles.dropdownItemSelected
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Hidden native select for form submission */}
        <select
          ref={ref}
          name={props.name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={styles.hiddenSelect}
          aria-hidden="true"
          tabIndex={-1}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <Text
            variant="BODY.SMALL"
            as="p"
            id={`${id}-error`}
            className={styles.errorText}
            role="alert"
          >
            {error}
          </Text>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
