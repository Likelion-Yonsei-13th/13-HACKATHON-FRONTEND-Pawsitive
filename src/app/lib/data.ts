export type User = {
  id: number;
  name: string;
  area: string;
};

export const data: User[] = [
  {
    id: 1,
    name: "김안녕",
    area: "서대문구",
  },
  {
    id: 2,
    name: "이안녕",
    area: "마포구",
  },
];

export default data;
