import React, {useState} from 'react'
import isEqual from 'react-fast-compare'

function ContractFieldDefinitionView({field, onChange}) {
    const [fieldDefinition, setFieldDefinition] = useState(field || {})

    function update(key, value) {
        const updated = {...fieldDefinition, [key]: value || undefined}
        if (!isEqual(updated, fieldDefinition)) {
            setFieldDefinition(updated)
            onChange((updated))
        }
    }

    const {name, type, description, rule} = fieldDefinition
    return <>
        <b><code>{name || <span className="dimmed">new field</span>}</code></b>
        <div style={{paddingLeft: '1em'}}>
            <div className="row">
                <div className="column column-50">
                    <label>
                        Field name:
                        <input type="text" value={name || undefined} placeholder="Short field name"
                               onChange={e => update('name', e.target.value.trim())}/>
                    </label>
                </div>
                <div className="column column-50">
                    <label>
                        Type:
                        <select value={type || 'string'} onChange={e => update('type', e.target.value)}>
                            <option value="string">String</option>
                            <option value="number">Number</option>
                        </select>
                    </label>
                </div>
                <div className="column column-50">
                    <label>
                        Description:
                        <textarea placeholder="what it is used for" value={description}
                                  onChange={e => update('description', e.target.value)}/>
                    </label>
                </div>
                <div className="column column-50">
                    <label>
                        Validation rule:
                        <textarea placeholder="what data should it contain" value={rule}
                                  onChange={e => update('rule', e.target.value)}/>
                    </label>
                </div>
            </div>
        </div>
    </>
}

export default function CreateContractFieldsView({fields = [], onChange}) {
    function updateField(index, fieldDefinition) {
        const newFields = fields.slice()
        newFields.splice(index, 1, fieldDefinition)
        onChange(newFields)
    }

    function addNewField() {
        const newFields = fields.slice()
        newFields.push({type: 'string'})
        onChange(newFields)
    }

    return <div className="segment">
        <h3>Fields</h3>
        <p className="dimmed">
            Request parameters that the contract expects to receive
        </p>
        {fields.map((f, i) =>
            <ContractFieldDefinitionView key={i} field={f} onChange={d => updateField(i, d)}/>
        )}
        <div className="text-small">
            <a href="#" onClick={() => addNewField()}>+ add new field</a>
        </div>
    </div>
}