import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Row, Col } from "antd";
import SchemaField from "./SchemaField";
import "antd/dist/antd.css";
import "../styles/SchemaBuilder.css";

type FieldType =
  | "string"
  | "number"
  | "nested"
  | "objectId"
  | "float"
  | "boolean";

export interface SchemaFieldData {
  id: string;
  name: string;
  type: FieldType;
  enabled: boolean;
  children?: SchemaFieldData[];
}

const SchemaBuilder: React.FC = () => {
  const { handleSubmit } = useForm();
  const [fields, setFields] = useState<SchemaFieldData[]>([]);

  const addField = () => {
    const newField: SchemaFieldData = {
      id: `field-${Date.now()}`,
      name: "",
      type: "string",
      enabled: true,
      children: [],
    };
    setFields([...fields, newField]);
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

    fields.forEach((field) => {
      if (field.enabled && field.name) {
        const fieldName = field.name.toLowerCase();
        if (field.type === "nested") {
          schema[fieldName] = generateNestedSchema(field.children || []);
        } else {
          schema[fieldName] = getValueForType(field.type);
        }
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
      case "objectId":
        return "objectId";
      case "float":
        return "float";
      case "boolean":
        return "boolean";
      default:
        return "";
    }
  };

  const generateNestedSchema = (
    children: SchemaFieldData[]
  ): Record<string, any> => {
    const schema: Record<string, any> = {};

    children.forEach((child) => {
      if (child.enabled && child.name) {
        const childName = child.name.toLowerCase();
        if (child.type === "nested") {
          schema[childName] = generateNestedSchema(child.children || []);
        } else {
          schema[childName] = getValueForType(child.type);
        }
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
    console.log("Schema submitted:", generateJsonSchema());
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
