import React from 'react';
import { Standing } from '../types';

interface StandingsTableProps {
  standings: Standing[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings }) => {
  return (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-900">
            <th className="px-4 py-3 text-left">Pos</th>
            <th className="px-4 py-3 text-left">Team</th>
            <th className="px-4 py-3 text-center">MP</th>
            <th className="px-4 py-3 text-center">W</th>
            <th className="px-4 py-3 text-center">D</th>
            <th className="px-4 py-3 text-center">L</th>
            <th className="px-4 py-3 text-center">GF</th>
            <th className="px-4 py-3 text-center">GA</th>
            <th className="px-4 py-3 text-center">GD</th>
            <th className="px-4 py-3 text-center">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {standings.map((standing) => (
            <tr
              key={standing.team.id}
              className="hover:bg-zinc-900/50 transition-colors"
            >
              <td className="px-4 py-3">{standing.rank}</td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={standing.team.logo}
                    alt={standing.team.name}
                    className="w-6 h-6"
                  />
                  <span>{standing.team.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">{standing.all.played}</td>
              <td className="px-4 py-3 text-center">{standing.all.win}</td>
              <td className="px-4 py-3 text-center">{standing.all.draw}</td>
              <td className="px-4 py-3 text-center">{standing.all.lose}</td>
              <td className="px-4 py-3 text-center">{standing.all.goals.for}</td>
              <td className="px-4 py-3 text-center">{standing.all.goals.against}</td>
              <td className="px-4 py-3 text-center">{standing.goalsDiff}</td>
              <td className="px-4 py-3 text-center font-medium">{standing.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;