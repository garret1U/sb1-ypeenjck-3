import { useState } from 'react';
import { Building2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ClubSignupProps {
  onComplete: (clubId: string) => void;
}

export function ClubSignup({ onComplete }: ClubSignupProps) {
  const [mode, setMode] = useState<'create' | 'join'>('join');
  const [clubName, setClubName] = useState('');
  const [clubCode, setClubCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string }>>([]);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create new club
      const { data: club, error: clubError } = await supabase
        .from('clubs')
        .insert([{ 
          name: clubName,
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          is_public: false
        }])
        .select()
        .single();

      if (clubError) throw clubError;

      // Create membership as admin
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert([{
          club_id: club.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'admin'
        }]);

      if (membershipError) throw membershipError;

      onComplete(club.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create club');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Find club by code
      const { data: club, error: clubError } = await supabase
        .from('clubs')
        .select()
        .eq('code', clubCode.toUpperCase())
        .single();

      if (clubError) throw new Error('Invalid club code');

      // Request to join
      const { error: membershipError } = await supabase
        .from('membership_requests')
        .insert([{
          club_id: club.id,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (membershipError) throw membershipError;

      onComplete(club.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join club');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('id, name')
        .eq('is_public', true)
        .ilike('name', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setMode('join')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            mode === 'join'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Join Existing Club
        </button>
        <button
          onClick={() => setMode('create')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            mode === 'create'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Create New Club
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {mode === 'create' ? (
        <form onSubmit={handleCreateClub} className="space-y-6">
          <div>
            <label htmlFor="clubName" className="block text-sm font-medium text-gray-700">
              Club Name *
            </label>
            <input
              id="clubName"
              type="text"
              required
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Club...' : 'Create Club'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search Public Clubs
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by club name..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 space-y-2">
                {searchResults.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => onComplete(club.id)}
                    className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                      {club.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or enter club code</span>
            </div>
          </div>

          <form onSubmit={handleJoinClub}>
            <div>
              <label htmlFor="clubCode" className="block text-sm font-medium text-gray-700">
                Club Code
              </label>
              <input
                id="clubCode"
                type="text"
                required
                value={clubCode}
                onChange={(e) => setClubCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Requesting to Join...' : 'Request to Join'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}