const UnderlineSvg = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 800 400"
      className={className}
    >
      <path
        d="M23.1182696621388 239.6057355946849C69.11587760853467 225.26881644592186 217.11467121052442 154.0322518096914 299.10391734051404 153.58422070210676C381.09316347050367 153.13618959452214 434.55792226401667 239.75506319071354 515.0537464420765 236.91754894917707C595.5495706201365 234.0800347076406 737.5746764144072 153.28553753560286 782.0788624088734 136.559135252888 "
        fill="none"
        strokeWidth="48"
        stroke='url("#SvgjsLinearGradient1001")'
        strokeLinecap="round"
        transform="matrix(0.9950062499999999,0,0,0.9950062499999999,-0.5880780791163147,12.856808646202097)"
      ></path>
      <defs>
        <linearGradient id="SvgjsLinearGradient1001">
          <stop stopColor="hsl(129, 33%, 58%)" offset="0"></stop>
          <stop stopColor="hsl(47, 61%, 91%)" offset="1"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export { UnderlineSvg };
