# JSON Schema Builder

A dynamic, interactive tool for building JSON schemas with a real-time preview.

## Features

- Create and edit JSON schema fields dynamically
- Support for data types:
  - String
  - Number
  - Nested objects
- Nested field support with unlimited depth
- Real-time JSON preview
- Enable/disable fields with toggle switches
- Responsive side-by-side layout

## Installation

1. Clone the repository:

```bash
git clone https://github.com/apurba-striker/frontend
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Fields

Click the "+ Add Item" button to add a new field to your schema. Each field consists of:

- A name input
- A type selector (string, number, nested)
- An enable/disable toggle
- A delete button

### Creating Nested Fields

1. Add a field and set its type to "nested"
2. Enable the field using the toggle switch
3. Additional "+ Add Item" buttons will appear for adding nested fields
4. Nested fields can be further nested to create complex hierarchical structures

### Real-time JSON Preview

The JSON preview on the right side updates in real-time as you build your schema, showing the exact JSON structure that will be generated.

### Submitting the Schema

Click the "Submit" button to finalize your schema. The final schema will be logged to the console.

## Project Structure

```
json-schema-builder/
├── src/
│   ├── components/
│   │   ├── SchemaBuilder.tsx    # Main component for the schema builder
│   │   └── SchemaField.tsx      # Component for individual fields
│   ├── styles/
│   │   └── SchemaBuilder.css    # Styles for the schema builder
│   ├── App.tsx                  # Root application component
│   └── index.tsx                # Application entry point
└── public/
    └── index.html               # HTML template
```

## Technologies Used

- React
- TypeScript
- Ant Design
- React Hook Form

## License

[MIT](LICENSE)
