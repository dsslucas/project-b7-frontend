export type Employee = {
    id: string;
    name: string;
    email: string;
    role: string;
    registerDate: string;
};

export const data: Employee[] = [
  {
    id: "67671",
    name: "Reese Benson",
    email: "reesebenson@enquility.com",
    role: "Administrador",
    registerDate: "2016-09-26"
  },
  {
    id: "67672",
    name: "Payne Goff",
    email: "paynegoff@enquility.com",
    role: "Estoquista",
    registerDate: "2018-07-02"
  },
  {
    id: "67673",
    name: "Iva Hutchinson",
    email: "ivahutchinson@enquility.com",
    role: "Estoquista",
    registerDate: "2019-08-26"
  },
  {
    id: "67674",
    name: "Rios Roberts",
    email: "riosroberts@enquility.com",
    role: "Estoquista",
    registerDate: "2020-05-13"
  },
  {
    id: "67675",
    name: "Dawn Foreman",
    email: "dawnforeman@enquility.com",
    role: "Administrador",
    registerDate: "2020-04-15"
  },
  {
    id: "67676",
    name: "Wilkinson Rodriguez",
    email: "wilkinsonrodriguez@enquility.com",
    role: "Estoquista",
    registerDate: "2015-05-24"
  }
]

export const roles = ["Administrador", "Estoquista"];