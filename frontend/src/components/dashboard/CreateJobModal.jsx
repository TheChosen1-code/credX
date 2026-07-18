import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { X } from 'lucide-react';

const initialState = {
  title: '',
  department: 'Engineering',
  location: '',
  employmentType: 'Full Time',
  experience: '1-3',
  minSalary: '',
  maxSalary: '',
  skills: [],
  description: '',
  deadline: ''
};

const CreateJobModal = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');

  const validate = useMemo(() => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Job title is required';
    if (!form.location.trim()) nextErrors.location = 'Location is required';
    if (!form.description.trim()) nextErrors.description = 'Description is required';
    if (!form.deadline) nextErrors.deadline = 'Deadline is required';
    if (!form.minSalary || !form.maxSalary) nextErrors.salary = 'Salary range is required';
    return nextErrors;
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const addSkill = () => {
    const cleaned = skillInput.trim();
    if (!cleaned) return;
    setForm((current) => ({ ...current, skills: [...current.skills, cleaned] }));
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setForm((current) => ({ ...current, skills: current.skills.filter((skill) => skill !== skillToRemove) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validate);
    if (Object.keys(validate).length > 0) return;

    onCreate({ ...form, id: Date.now() });
    setForm(initialState);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Job">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="job-title" className="mb-2 block text-sm font-medium text-gray-700">Job Title</label>
            <input id="job-title" name="title" value={form.title} onChange={handleChange} className={`w-full rounded-xl border px-3 py-2.5 outline-none transition ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`} placeholder="Senior Product Designer" />
            {errors.title ? <p className="mt-1 text-sm text-red-500">{errors.title}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Department</label>
            <select name="department" value={form.department} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-blue-500">
              <option>Engineering</option>
              <option>Product</option>
              <option>Design</option>
              <option>Operations</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="job-location" className="mb-2 block text-sm font-medium text-gray-700">Location</label>
            <input id="job-location" name="location" value={form.location} onChange={handleChange} className={`w-full rounded-xl border px-3 py-2.5 outline-none transition ${errors.location ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`} placeholder="Remote / Bangalore" />
            {errors.location ? <p className="mt-1 text-sm text-red-500">{errors.location}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Employment Type</label>
            <select name="employmentType" value={form.employmentType} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-blue-500">
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Experience</label>
            <select name="experience" value={form.experience} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-blue-500">
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Salary Range</label>
            <div className="flex gap-2">
              <input name="minSalary" value={form.minSalary} onChange={handleChange} className={`w-full rounded-xl border px-3 py-2.5 outline-none transition ${errors.salary ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`} placeholder="Min" />
              <input name="maxSalary" value={form.maxSalary} onChange={handleChange} className={`w-full rounded-xl border px-3 py-2.5 outline-none transition ${errors.salary ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`} placeholder="Max" />
            </div>
            {errors.salary ? <p className="mt-1 text-sm text-red-500">{errors.salary}</p> : null}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Skills Required</label>
          <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 p-2">
            {form.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="rounded-full p-0.5 hover:bg-blue-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input value={skillInput} onChange={(event) => setSkillInput(event.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-blue-500" placeholder="React, SQL, Product" />
            <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
          </div>
        </div>

        <div>
          <label htmlFor="job-description" className="mb-2 block text-sm font-medium text-gray-700">Job Description</label>
          <textarea id="job-description" name="description" value={form.description} onChange={handleChange} rows={5} className={`w-full rounded-xl border px-3 py-2.5 outline-none transition ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`} placeholder="Describe the role, responsibilities, and what you are looking for." />
          {errors.description ? <p className="mt-1 text-sm text-red-500">{errors.description}</p> : null}
        </div>

        <div>
          <label htmlFor="deadline" className="mb-2 block text-sm font-medium text-gray-700">Application Deadline</label>
          <input id="deadline" type="date" name="deadline" value={form.deadline} onChange={handleChange} className={`w-full rounded-xl border px-3 py-2.5 outline-none transition ${errors.deadline ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`} />
          {errors.deadline ? <p className="mt-1 text-sm text-red-500">{errors.deadline}</p> : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Publish Job</Button>
        </div>
      </form>
    </Modal>
  );
};

CreateJobModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default CreateJobModal;
