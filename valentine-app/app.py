from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import sqlite3
import uuid
import os
from datetime import datetime
import random

app = Flask(__name__)
app.secret_key = 'super-secret-valentine-key-2026'

#Application file for valentine app: Python codes for the application

# Database setup
def init_db():
    conn = sqlite3.connect('proposals.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS proposals
                 (id TEXT PRIMARY KEY, no_clicks INTEGER, accepted BOOLEAN, 
                  timestamp DATETIME, ip TEXT, user_agent TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS stats
                 (date TEXT PRIMARY KEY, visits INTEGER, accepts INTEGER)''')
    conn.commit()
    conn.close()

# Initialize database
init_db()

def get_stats():
    conn = sqlite3.connect('proposals.db')
    c = conn.cursor()
    c.execute("SELECT SUM(no_clicks) as total_no_clicks, COUNT(*) as total_proposals, "
              "SUM(CASE WHEN accepted=1 THEN 1 ELSE 0 END) as accepts FROM proposals")
    stats = c.fetchone()
    conn.close()
    return stats or (0, 0, 0)

def update_daily_stats():
    today = datetime.now().strftime('%Y-%m-%d')
    conn = sqlite3.connect('proposals.db')
    c = conn.cursor()
    c.execute("INSERT OR IGNORE INTO stats (date, visits, accepts) VALUES (?, 0, 0)", (today,))
    c.execute("UPDATE stats SET visits = visits + 1 WHERE date = ?", (today,))
    conn.commit()
    conn.close()

@app.route('/')
def index():
    update_daily_stats()
    total_no, total_props, accepts = get_stats()
    accept_rate = (accepts / max(total_props, 1)) * 100
    return render_template('index.html', 
                         stats={'no_clicks': total_no, 'total': total_props, 'rate': accept_rate})

@app.route('/proposal/<proposal_id>')
def proposal(proposal_id):
    session['proposal_id'] = proposal_id
    session['no_clicks'] = 0
    return render_template('proposal.html', proposal_id=proposal_id)

@app.route('/api/no_click', methods=['POST'])
def no_click():
    if 'proposal_id' not in session:
        return jsonify({'error': 'No proposal session'})
    
    session['no_clicks'] = session.get('no_clicks', 0) + 1
    no_clicks = session['no_clicks']
    
    # Progressive difficulty data
    speed = min(1 + no_clicks * 0.02, 2)
    scale = max(0.7 - no_clicks * 0.01, 0.4)
    
    taunts = [
        "Getting away won't be that easy! 😏",
        "Come on, you know the answer! 😉", 
        "Stop running, say YES! 💍",
        "You're making this harder than it needs to be! 😤",
        "Persistent much? Just say YES! 🥺"
    ]
    
    taunt = random.choice(taunts) if no_clicks % 5 == 0 else None
    
    return jsonify({
        'no_clicks': no_clicks,
        'speed': speed,
        'scale': scale,
        'taunt': taunt
    })

@app.route('/api/yes', methods=['POST'])
def yes_click():
    if 'proposal_id' not in session:
        return jsonify({'error': 'No proposal session'})
    
    proposal_id = session['proposal_id']
    no_clicks = session.get('no_clicks', 0)
    
    # Save to database
    conn = sqlite3.connect('proposals.db')
    c = conn.cursor()
    c.execute("INSERT INTO proposals VALUES (?, ?, 1, ?, ?, ?)",
              (proposal_id, no_clicks, datetime.now(), request.remote_addr, request.user_agent.string))
    conn.commit()
    conn.close()
    
    update_daily_stats()
    
    return jsonify({'success': True, 'no_clicks': no_clicks, 'share_url': f'/success/{proposal_id}'})

@app.route('/success/<proposal_id>')
def success(proposal_id):
    conn = sqlite3.connect('proposals.db')
    c = conn.cursor()
    c.execute("SELECT no_clicks FROM proposals WHERE id = ? AND accepted = 1", (proposal_id,))
    result = c.fetchone()
    conn.close()
    
    no_clicks = result[0] if result else 0
    return render_template('success.html', proposal_id=proposal_id, no_clicks=no_clicks)

@app.route('/stats')
def stats():
    conn = sqlite3.connect('proposals.db')
    c = conn.cursor()
    c.execute("SELECT date, visits, accepts FROM stats ORDER BY date DESC LIMIT 30")
    daily_stats = c.fetchall()
    total_stats = get_stats()
    conn.close()
    
    return render_template('stats.html', daily=daily_stats, total=total_stats)

@app.route('/new_proposal')
def new_proposal():
    proposal_id = str(uuid.uuid4())[:8]
    return redirect(url_for('proposal', proposal_id=proposal_id))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
