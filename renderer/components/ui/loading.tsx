import * as React from 'react';

const css = `
@keyframes lds-ellipsis1 {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
@keyframes lds-ellipsis3 {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}
@keyframes lds-ellipsis2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(24px, 0); }
}
.loading-container {
  display: grid;
  height: 100%;
  place-items: center;
  padding: 16px;
}
.loading-spinner {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.loading-spinner div {
  position: absolute;
  top: 33px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: green;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.loading-spinner :nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.loading-spinner :nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.loading-spinner :nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.loading-spinner :nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
`;

const Loading: React.FC = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="loading-container">
        <div className="loading-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Loading;
