interface ButtonProps {
  title: string;
  onClick?: any;
}

function Button({ title, onClick }: ButtonProps) {
  return <button
  onClick={onClick}
  style={{ background: 'white', color: "black" }}
  className="transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-900 hover:text-white hover:shadow-lg px-6 py-3 text-lg font-semibold border-2 border-black mt-8 mb-4 mx-3"
>
  {title}
</button>;
}

export default Button;
