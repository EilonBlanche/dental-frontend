import React from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

export const FormModal = ({
  show,
  handleClose,
  title,
  formData,
  setFormData,
  onSubmit,
  errorMessage,
  formFields
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form>
          {formFields.map((field, idx) => {
            if (field.type === 'select') {
              return (
                <Form.Group key={idx} className="mb-2">
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Select
                    value={formData[field.name]}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, [field.name]: e.target.value }))
                    }
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              );
            }

            if (field.type === 'checkbox') {
              return (
                <Form.Group key={idx} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label={field.label}
                    checked={!!formData[field.name]}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, [field.name]: e.target.checked }))
                    }
                  />
                </Form.Group>
              );
            }

            if (field.type === 'password') {
              return (
                <Form.Group key={idx} className="mb-2">
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData[field.name] || ''}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, [field.name]: e.target.value }))
                    }
                    required={field.required || false}
                  />
                </Form.Group>
              );
            }

            if (field.type === 'date') {
              return (
                <Form.Group key={idx} className="mb-2">
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData[field.name]}
                    min={field.min}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, [field.name]: e.target.value }))
                    }
                    onKeyDown={e => e.preventDefault()} // disable keyboard
                  />
                </Form.Group>
              );
            }

            if (field.type === 'schedule') {
              return (
                <Form.Group key={idx} className="mb-2">
                  <Form.Label>{field.label}</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Select
                      value={formData[field.subFields[0].name]}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          [field.subFields[0].name]: e.target.value,
                          [field.subFields[1].name]: ''
                        }))
                      }
                    >
                      <option value="">Select Time From</option>
                      {field.subFields[0].options.map(t => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Form.Select>

                    <Form.Select
                      value={formData[field.subFields[1].name]}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, [field.subFields[1].name]: e.target.value }))
                      }
                    >
                      <option value="">Select Time To</option>
                      {field.subFields[1].options.map(t => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              );
            }

            // Default: text, email
            return (
              <Form.Group key={idx} className="mb-2">
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  value={formData[field.name]}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, [field.name]: e.target.value }))
                  }
                  required={field.required || false}
                />
              </Form.Group>
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={onSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

// Reusable confirm modal for cancel/delete
export const ConfirmModal = ({ show, handleClose, title, body, confirmText, variant, onConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
