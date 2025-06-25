import Header from "../common/Header";

export default function SearchHeader({ title, onBack }) {
  return <Header title={title} showBackButton={true} onBack={onBack} />;
}