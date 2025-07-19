// Import React without using element.ref
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Row, Col } from "antd";
import SchemaField from "./SchemaField";
import "antd/dist/antd.css";
import "../styles/SchemaBuilder.css";

type FieldType = "string" | "number" | "nested";

export interface SchemaFieldData {
  id: string;
  name: string;
  type: FieldType;
  enabled: boolean;
  children?: SchemaFieldData[];
  order?: number;
}

const SchemaBuilder: React.FC = () => {
  const { handleSubmit } = useForm();
  const [fields, setFields] = useState<SchemaFieldData[]>([]);
  const [fieldCounter, setFieldCounter] = useState(0);

  const addField = () => {
    const newField: SchemaFieldData = {
      id: `field-${Date.now()}`,
      name: "",
      type: "string",
      enabled: true,
      children: [],
      order: fieldCounter,
    };
    setFields([...fields, newField]);
    setFieldCounter(fieldCounter + 1);
  };

  const updateField = (id: string, updatedField: Partial<SchemaFieldData>) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, ...updatedField } : field
      )
    );
  };

  const deleteField = (id: string) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const generateJsonSchema = () => {
    const schema: Record<string, any> = {};

    // Sort fields by their order (the order they were added)
    const sortedFields = [...fields]
      .filter((field) => field.enabled && field.name)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Process fields in their sorted order
    sortedFields.forEach((field) => {
      const fieldName = field.name.toLowerCase();
      if (field.type === "nested") {
        schema[fieldName] = generateNestedSchema(
          field.children || [],
          field.id
        );
      } else {
        schema[fieldName] = getValueForType(field.type);
      }
    });

    return schema;
  };

  const getValueForType = (type: FieldType) => {
    switch (type) {
      case "string":
        return "STRING";
      case "number":
        return "number";
      default:
        return "";
    }
  };

  const generateNestedSchema = (
    children: SchemaFieldData[],
    parentId: string
  ): any => {
    const schema: Record<string, any> = {};

    // Sort children by their order (the order they were added)
    const sortedChildren = [...children]
      .filter((child) => child.enabled && child.name)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Process children in their sorted order
    sortedChildren.forEach((child) => {
      const childName = child.name.toLowerCase();
      if (child.type === "nested") {
        schema[childName] = generateNestedSchema(
          child.children || [],
          child.id
        );
      } else {
        schema[childName] = getValueForType(child.type);
      }
    });

    return schema;
  };

  const formatJsonOutput = (obj: Record<string, any>, level = 0): string => {
    const indent = " ".repeat(level * 2);
    const nextIndent = " ".repeat((level + 1) * 2);
    let result = "{\n";

    const entries = Object.entries(obj);
    entries.forEach(([key, value], index) => {
      result += `${nextIndent}"${key}": `;

      if (typeof value === "object" && value !== null) {
        result += formatJsonOutput(value, level + 1);
      } else if (typeof value === "string") {
        result += `"${value}"`;
      } else {
        result += `${value}`;
      }

      if (index < entries.length - 1) {
        result += ",";
      }
      result += "\n";
    });

    result += `${indent}}`;
    return result;
  };

  const onSubmit = () => {
    const schema = generateJsonSchema();
    console.log("Schema submitted:");
    console.log(JSON.stringify(schema, null, 2));
  };

  return (
    <div className="schema-builder-container">
      <Row gutter={16}>
        <Col span={12}>
          <Card className="schema-builder-card">
            {fields.map((field) => (
              <SchemaField
                key={field.id}
                field={field}
                updateField={updateField}
                deleteField={deleteField}
                depth={0}
              />
            ))}
            <Button
              type="primary"
              onClick={addField}
              className="add-field-button"
            >
              + Add Item
            </Button>
          </Card>
          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            className="submit-button"
          >
            Submit
          </Button>
        </Col>
        <Col span={12}>
          <Card className="json-preview-card">
            <pre>{formatJsonOutput(generateJsonSchema())}</pre>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SchemaBuilder;
