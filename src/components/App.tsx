/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useState, ChangeEvent } from 'react'

// Define the type for the list of objects
interface DataObject {
  [key: string]: any
}

function App() {
  const [inputData, setInputData] = useState<string>('')
  const [parsedData, setParsedData] = useState<DataObject[]>([])
  const [filterText, setFilterText] = useState<string>('')
  const [filteredList, setFilteredList] = useState<DataObject[]>([])
  const [selectedKey, setSelectedKey] = useState<string>('All Keys')

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string
          const data = JSON.parse(text)
          console.log('text', data)

          if (Array.isArray(data)) {
            setParsedData(data)
            setInputData(JSON.stringify(data, null, 2))
            setFilteredList(data)
          } else {
            alert('JSON should be an array of objects.')
          }
        } catch (error) {
          alert('Invalid JSON format in file.')
        }
      }
      reader.readAsText(file)
    }
  }

  const parseInputData = () => {
    try {
      const data = JSON.parse(inputData)
      if (Array.isArray(data)) {
        setParsedData(data)
        setFilteredList(data)
      } else {
        alert('Input should be a JSON array of objects.')
      }
    } catch (error) {
      alert('Invalid JSON format.')
    }
  }

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setFilterText(text)

    const filtered = parsedData.filter((item) => {
      if (selectedKey === 'All Keys') {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(text.toLowerCase())
        )
      } else {
        return item[selectedKey]
          ?.toString()
          .toLowerCase()
          .includes(text.toLowerCase())
      }
    })

    setFilteredList(filtered)
  }

  const handleKeyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedKey(e.target.value)
    // Reapply filter when key changes
    handleFilterChange({
      target: { value: filterText }
    } as ChangeEvent<HTMLInputElement>)
  }

  // Get unique keys from the parsed data
  const keys = parsedData.length > 0 ? Object.keys(parsedData[0]) : []

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-8">
      <div className="container flex w-full overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="flex-1 p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Input Data:
            {parsedData.length > 0 ? parsedData.length : '0'}
          </h2>
          <textarea
            value={inputData}
            onChange={handleInputChange}
            placeholder="Enter JSON array of objects here"
            rows={10}
            className="mb-4 w-full rounded border border-gray-300 p-3"
          />
          <button
            onClick={parseInputData}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Parse JSON
          </button>
          <br />
          <input
            type="file"
            accept=".txt,.json"
            onChange={handleFileChange}
            className="mt-4"
          />
        </div>

        <div className="flex-1 border-l border-gray-200 p-6">
          <h2 className="mb-4 text-2xl font-bold">Filter</h2>
          <div className="mb-4">
            <label className="mb-2 block text-lg font-semibold">
              Select Key:
            </label>
            <select
              value={selectedKey}
              onChange={handleKeyChange}
              className="mb-4 w-full rounded border border-gray-300 p-3"
            >
              <option value="All Keys">All Keys</option>
              {keys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Filter text"
            className="mb-4 w-full rounded border border-gray-300 p-3"
          />
          <h3 className="mb-2 text-lg font-semibold">
            Filtered List: {filteredList.length ? filteredList.length : '0'}
          </h3>
          <div className="max-h-[60vh] overflow-y-auto rounded border border-gray-300 bg-gray-50 p-3">
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(filteredList, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
