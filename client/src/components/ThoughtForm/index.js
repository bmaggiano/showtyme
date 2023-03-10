import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const ThoughtForm = () => {
  const [workerForm, setWorkerForm] = useState({
    thought: '',
    hours: '',
    patients: '',
  });

  const [addThought, { error }] = useMutation(ADD_THOUGHT);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addThought({
        variables: {
          hoursWorked: workerForm.hours,
          patientsWorked: parseInt(workerForm.patients),
          thoughtText: workerForm.thought,
          thoughtAuthor: Auth.getProfile().data.username,
        },
      });

      setWorkerForm({ thought: '', hours: '', patients: '' })
      window.location.reload()
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    // const { name, value } = event.target;
    setWorkerForm({
      ...workerForm,
      [e.target.name]: e.target.value,
  });
  };

  return (
    <div>
      <h3>Worker Form</h3>

      {Auth.loggedIn() ? (
        <>

          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <input
              type="text"
              name="hours"
              placeholder='hours worked'
              value={workerForm.hours}
              className="form-input w-100"
              onChange={handleChange}
              style={{ lineHeight: '1.5', resize: 'vertical' }}
              ></input>
              <input
              type="number"
              name="patients"
              placeholder='patients worked'
              value={workerForm.patients}
              className="form-input w-100"
              onChange={handleChange}
              style={{ lineHeight: '1.5', resize: 'vertical' }}
              ></input>
              <input
                type="text"
                name="thought"
                placeholder="Lexiscan Remaining"
                value={workerForm.thought}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></input>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Add Workday
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to share your thoughts. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default ThoughtForm;
