import { useEffect } from 'react'

function useClickOutsideMe(ref, element) {
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {

                if (
                    e.target.classList.contains('search-input') ||
                    e.target.classList.contains('search-icon') ||
                    e.target.classList.contains('navbar-search--anime') ||
                    e.target.classList.contains('navbar-list-anime') ||
                    e.target.classList.contains('navbar-anime-item') ||
                    e.target.classList.contains('navbar-anime-item--thumbnail') ||
                    e.target.classList.contains('navbar-anime-item-link') ||
                    e.target.classList.contains('navbar-anime-item-img') ||
                    e.target.classList.contains('navbar-anime-item--precis') ||
                    e.target.classList.contains('navbar-anime-item--name') ||
                    e.target.classList.contains('navbar-anime-item--views') ||
                    e.target.classList.contains('navbar-anime-item--time')
                ) { return; }
                if (element === '.header-sidebar') {
                    document.querySelector('.navbar-search').classList.remove('active');
                }
                document.querySelector(element).classList.remove('active');

            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [element, ref]);
}

export default useClickOutsideMe
