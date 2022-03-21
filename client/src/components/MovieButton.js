import React from 'react';
import { useNavigate } from 'react-router-dom';
import { image_url } from '../constants';
import '../styles/App.css';

function MovieButton({ id, title, poster_path, popularity, polarity, show, max_height }) {
    const navigate = useNavigate();

    const handleClick = (click) => {
        switch (click.button) {
            case 0:
                return navigate(`/movie/${id}`, { replace: true });
            case 1:
                window.open(`http://localhost:3000/movie/${id}`, "_blank")
                return window.focus();
            default:
                return;
        }
    }

    const h = 'h-[' + max_height + 'px]';
    const max_h = 'max-h-[' + max_height + 'px]';

    const style = `
        aspect-[2/3] cursor-pointer 
        rounded-xl border-y-2 border-stone-800 
        hover:border-[#0000ff] hover:scale-105 duration-[300ms] 
    `;

    if (poster_path) {
        return (
            <a 
                className={`relative mx-2 my-3 aspect-[2/3] h-[270px] group`} 
                href={`/movie/${id}`}
            >
                <img 
                    className={`
                        max-h-[270px] object-contain aspect-[2/3] rounded-xl border-y-2 border-stone-800 group-hover:border-[#0000ff] group-hover:scale-105 duration-[300ms]
                    `.trim()} 
                    src={`${image_url}${poster_path}`} 
                    alt={title} 
                />
                {show ? 
                    <div className='absolute inset-0 -top-1 group-hover:scale-105 duration-[300ms] h-9'>
                        <div className='inline-flex polygon font-medium h-full w-11 ml-3 -top-4 justify-center bg-red-700'>{polarity != null ? polarity.toFixed(1) : '-'}</div>
                        <div className='inline-flex polygon font-medium h-full w-11 ml-3 -top-4 justify-center bg-yellow-600'>{popularity != null ? popularity.toFixed(1) : '-'}</div>
                    </div>
                    : <></>
                }
            </a>
        )
    } else {
        return (
            <a 
                className={`relative mx-2 my-3 aspect-[2/3] ${h} group`} 
                href={`/movie/${id}`}
            >
                <div 
                    className={`
                        ${h} flex justify-center items-center text-center font-semibold p-3 aspect-[2/3] cursor-pointer rounded-xl border-y-2 border-stone-800 hover:border-[#0000ff] hover:scale-105 duration-[300ms] 
                    `.trim()}
                >
                    {title}
                </div>
                {show ? 
                    <div className='absolute inset-0 -top-1 group-hover:scale-105 duration-[300ms] h-9'>
                        <div className='inline-flex polygon font-medium h-full w-11 ml-3 -top-4 justify-center bg-red-700'>{polarity != null ? polarity.toFixed(1) : '-'}</div>
                        <div className='inline-flex polygon font-medium h-full w-11 ml-3 -top-4 justify-center bg-yellow-600'>{popularity != null ? popularity.toFixed(1) : '-'}</div>
                    </div>
                    : <></>
                }
            </a>
        )
    }
}

export default MovieButton;