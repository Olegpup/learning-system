import React, { useState } from 'react';
import LabelInput from '../../../components/Forms/LabelInput';
import { createStudent } from '../../../api/groups';
import { useParams } from 'react-router-dom';

const UserForm = ({update}) => {
  const { group } = useParams(); 
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentSecondName, setStudentSecondName] = useState('');
  const [studentFatherName, setStudentFatherName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      const response = await createStudent(group, studentFirstName, studentSecondName, studentFatherName);

      if (response) {
        setMessage('Учня успішно додано до групи');
        setStudentFirstName('');
        setStudentSecondName('');
        setStudentFatherName('');
        update();
      } else {
        setMessage('Не вдалося додати учня');
      }
    } catch (error) {
      setMessage('Сталася помилка при додаванні учня');
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <LabelInput
        label="Ім'я"
        name="first_name"
        value={studentFirstName}
        id="first_name"
        placeholder="Введіть ваше Ім'я"
        type="text"
        required={true}
        setValue={setStudentFirstName}
      />

      <LabelInput
        label="Прізвище"
        name="second_name"
        value={studentSecondName}
        id="second_name"
        placeholder="Введіть ваше Прізвище"
        type="text"
        required={true}
        setValue={setStudentSecondName}
      />

      <LabelInput
        label="По батькові"
        name="father_name"
        value={studentFatherName}
        id="father_name"
        placeholder="Введіть ваше По батькові"
        type="text"
        required={true}
        setValue={setStudentFatherName}
      />

      <input
        type="submit"
        id="register-button"
        value="Додати"
        className="transition-colors duration-300 ease-in-out cursor-pointer bg-black border border-black text-white rounded-full py-3 mt-8
            hover:bg-transparent hover:text-black"
      />

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </form>
  );
};

export default UserForm;
