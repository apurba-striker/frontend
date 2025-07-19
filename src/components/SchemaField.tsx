import React from "react";
import { Input, Select, Button, Switch, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { SchemaFieldData } from "./SchemaBuilder";

const { Option } = Select;

interface SchemaFieldProps {
  field: SchemaFieldData;
  updateField: (id: string, field: Partial<SchemaFieldData>) => void;
  deleteField: (id: string) => void;
  depth: number;
}

const SchemaField: React.FC<SchemaFieldProps> = ({
  field,
  updateField,
  deleteField,
  depth,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(field.id, { name: e.target.value });
  };

  const handleTypeChange = (
    value: "string" | "number" | "nested" | "objectId" | "float" | "boolean"
  ) => {
    updateField(field.id, { type: value });
  };

  const handleEnabledChange = (checked: boolean) => {
    updateField(field.id, { enabled: checked });
  };

  const addNestedField = () => {
    const newNestedField: SchemaFieldData = {
      id: `field-${Date.now()}`,
      name: "",
      type: "string",
      enabled: true,
      children: [],
    };

    updateField(field.id, {
      children: [...(field.children || []), newNestedField],
    });
  };

  const updateNestedField = (
    id: string,
    updatedField: Partial<SchemaFieldData>
  ) => {
    updateField(field.id, {
      children: field.children?.map((child) =>
        child.id === id ? { ...child, ...updatedField } : child
      ),
    });
  };

  const deleteNestedField = (id: string) => {
    updateField(field.id, {
      children: field.children?.filter((child) => child.id !== id),
    });
  };

  return (
    <div className="schema-field" style={{ marginLeft: `${depth * 20}px` }}>
      <Space className="field-row" align="center">
        <Input
          placeholder="Field name"
          value={field.name}
          onChange={handleNameChange}
          className="field-name-input"
        />
        <Select
          value={field.type}
          onChange={handleTypeChange}
          className="field-type-select"
          dropdownMatchSelectWidth={false}
        >
          <Option value="string">string</Option>
          <Option value="number">number</Option>
          <Option value="nested">nested</Option>
          <Option value="objectId">objectId</Option>
          <Option value="float">float</Option>
          <Option value="boolean">boolean</Option>
        </Select>
        <Switch
          checked={field.enabled}
          onChange={handleEnabledChange}
          className="field-enabled-switch"
          size="small"
        />
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => deleteField(field.id)}
          className="delete-field-button"
          size="small"
        />
      </Space>

      {field.type === "nested" && field.enabled && (
        <div className="nested-fields">
          {field.children?.map((childField) => (
            <SchemaField
              key={childField.id}
              field={childField}
              updateField={updateNestedField}
              deleteField={deleteNestedField}
              depth={depth + 1}
            />
          ))}
          <Button
            type="primary"
            onClick={addNestedField}
            className="add-nested-field-button"
            style={{ marginLeft: `${(depth + 1) * 20}px` }}
          >
            + Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchemaField;
