const SectionContainer = ({ children, className = '' }) => {
  return (
    <section className={`py-12 px-4 container mx-auto ${className}`}>
      {children}
    </section>
  );
};

export default SectionContainer;
