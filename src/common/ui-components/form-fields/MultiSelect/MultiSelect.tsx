import { forwardRef, useState } from "react"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { Check, ChevronDown, X } from "lucide-react"
import clsx from "clsx"

interface Option {
  value: string
  label: string
}

interface IMultiSelectProps {
  options: Option[]
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  value?: Option[]
//   onChange: (selectedOptions: Option[]) => void
}

const MultiSelect = forwardRef<HTMLButtonElement, IMultiSelectProps>(
  (
    { options, label, error, helperText, placeholder = "Select options", value = [] },
    ref,
  ) => {
    const [selected, setSelected] = useState<Option[]>(value)

    const handleChange = (newSelected: Option[]) => {
      setSelected(newSelected)
    //   onChange(newSelected)
    }

    const clearSelections = () => {
      setSelected([])
    //   onChange([])
    }

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <Listbox value={selected} onChange={handleChange} multiple>
          <div className="relative mt-1">
            <ListboxButton
              ref={ref}
              className={clsx(
                "relative w-full cursor-default rounded-lg border bg-white px-4 py-3 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm",
                {
                  "border-red-600": error,
                  "border-gray-300": !error,
                },
              )}
            >
              <span className="block truncate">
                {selected.length === 0 ? placeholder : selected.map((option) => option.label).join(", ")}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        {selected.length > 0 && (
          <button
            onClick={clearSelections}
            className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X className="h-4 w-4 mr-1" />
            Clear selections
          </button>
        )}

        {/* Helper Text */}
        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}

        {/* Error Message */}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)

MultiSelect.displayName = "MultiSelect"

export default MultiSelect
