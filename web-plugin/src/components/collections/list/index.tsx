import { useState } from 'react';
import './index.css';
import { Plus } from 'lucide-react';

export function CollectionList() {
    const [count, setCount] = useState(0);

    return (
        <div className="root">
            <div className='header'>
                <h1 className='title'>Your collections</h1>
            </div>
            <div className='content'>

            </div>
            <div className='footer'>
                <button>
                    <Plus />
                    Create
                </button>
            </div>
        </div>
    );
}


export default CollectionList;
