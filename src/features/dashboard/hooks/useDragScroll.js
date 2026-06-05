import { useRef, useEffect } from 'react';

export default function useDragScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const ele = ref.current;
    if (!ele) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      ele.classList.add('cursor-grabbing');
      ele.classList.remove('cursor-grab');
      startX = e.pageX - ele.offsetLeft;
      scrollLeft = ele.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      ele.classList.remove('cursor-grabbing');
      ele.classList.add('cursor-grab');
    };

    const onMouseUp = () => {
      isDown = false;
      ele.classList.remove('cursor-grabbing');
      ele.classList.add('cursor-grab');
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - ele.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      ele.scrollLeft = scrollLeft - walk;
    };

    ele.addEventListener('mousedown', onMouseDown);
    ele.addEventListener('mouseleave', onMouseLeave);
    ele.addEventListener('mouseup', onMouseUp);
    ele.addEventListener('mousemove', onMouseMove);

    // Initial class
    ele.classList.add('cursor-grab');

    return () => {
      ele.removeEventListener('mousedown', onMouseDown);
      ele.removeEventListener('mouseleave', onMouseLeave);
      ele.removeEventListener('mouseup', onMouseUp);
      ele.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return ref;
}

