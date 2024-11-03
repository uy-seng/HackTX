export default function LeaderboardPage({ data }) {
  console.log(data);
  return <div className="bg-blue-400 h-screen w-screen pt-3 px-3 flex flex-col gap-y-4">
    <h1 className="text-center text-5xl">Leaderboard</h1>
    <div className="w-4/5 bg-white h-full mx-auto rounded-t-xl p-4">
      <div className="border-b-2 border-gray flex justify-between px-3">
        <h1 className="text-black text-5xl">Name</h1>
        <h1 className="text-black text-5xl">Score</h1>
      </div>
      <div className="my-3">
        {data.map((user, idx) => (
          <div key={idx} className="flex justify-between px-3 my-3">
            <h1 className="text-black text-3xl">{user.username}</h1>
            <h1 className="text-black text-3xl">{user.score}</h1>
          </div>
        ))}
      </div>
    </div>
  </div>
}

export const getServerSideProps = async(ctx) => {
  const temp = await fetch("http://localhost:3001/leaderboard", {
    method: "GET"
  });
  const { data } = await temp.json();
  return {
    props: {
      data
    }
  }
}