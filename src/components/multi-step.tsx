import { transactionSchema } from "@/utils/formValidate";
import React, { useState } from "react";
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    amount: 0,
    category: "",
    attachments: [],
    recurring: false,
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Estado para erros

  const nextStep = () => {
    const validationResult = transactionSchema.safeParse(formData); // Validando os dados

    if (validationResult.success) {
      setStep((prevStep) => Math.min(prevStep + 1, 5));
      setErrors({});
    } else {
      const newErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
    }
  };

  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h3>Passo 1: Tipo de Transação</h3>
          <input
            type="radio"
            name="type"
            value="income"
            onChange={handleChange}
            checked={formData.type === "income"}
          />
          <label>Receita</label>
          <input
            type="radio"
            name="type"
            value="expense"
            onChange={handleChange}
            checked={formData.type === "expense"}
          />
          <label>Despesa</label>
          {errors.type && <p className="text-red-500">{errors.type}</p>}
          <button onClick={nextStep}>Próximo</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Passo 2: Categorização e Detalhamento</h3>
          <input
            type="text"
            name="description"
            placeholder="Descrição"
            onChange={handleChange}
            value={formData.description}
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}

          <input
            type="number"
            name="amount"
            placeholder="Valor"
            onChange={handleChange}
            value={formData.amount}
          />
          {errors.amount && <p className="text-red-500">{errors.amount}</p>}

          <button onClick={nextStep}>Próximo</button>
          <button onClick={prevStep}>Voltar</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h3>Passo 3: Anexos e Comprovantes</h3>
          <input
            type="file"
            name="attachments"
            onChange={handleChange}
            multiple
          />
          <button onClick={nextStep}>Próximo</button>
          <button onClick={prevStep}>Voltar</button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h3>Passo 4: Agendamento e Recorrência</h3>
          <input
            type="checkbox"
            name="recurring"
            onChange={(e) =>
              setFormData({ ...formData, recurring: e.target.checked })
            }
          />
          <label>Recorrente</label>
          {formData.recurring && (
            <div>
              <input
                type="date"
                name="startDate"
                onChange={handleChange}
                value={formData.startDate}
              />
              <input
                type="date"
                name="endDate"
                onChange={handleChange}
                value={formData.endDate}
              />
            </div>
          )}
          <button onClick={nextStep}>Próximo</button>
          <button onClick={prevStep}>Voltar</button>
        </div>
      )}
      {step === 5 && (
        <div>
          <h3>Passo 5: Revisão e Confirmação</h3>
          <p>Tipo de Transação: {formData.type}</p>
          <p>Descrição: {formData.description}</p>
          <p>Valor: {formData.amount}</p>
          <p>Anexos: {formData.attachments.length}</p>
          <p>Recorrente: {formData.recurring ? "Sim" : "Não"}</p>
          <button onClick={() => alert("Transação salva!")}>Salvar</button>
          <button onClick={prevStep}>Voltar</button>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
