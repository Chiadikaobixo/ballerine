export interface TitleOptions {
  text: string;
}

export interface TitleProps {
  options: TitleOptions;
}

export const Title = ({ options = { text: '' } }: TitleProps) => {
  const { text = '' } = options;

  return <h1 className="py-4 text-3xl font-bold">{text}</h1>;
};
