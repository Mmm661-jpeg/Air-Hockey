import { useNavigate } from "react-router-dom"


function MainMenu()
{
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-400">
          <div className="flex flex-col items-center justify-between gap-5 p-8 bg-white rounded-lg shadow-xl w-96 h-100">
            <h1 className="text-3xl font-bold font-primary m-2">Welcome to Air-Hockey</h1>
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => navigate('/singleplayer')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-primary"
              >
                Single-Player
              </button>
              <button
              onClick={()=>navigate('/multiplayer')}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-primary"
              >
                Multi-Player
              </button>
            </div>
          </div>
        </div>
    )
}


export default MainMenu