#!/usr/bin/env python

import os, sys
import urllib2
import re
import datetime
import pylab

urls = ['/web/20110313084709/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110422125202/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110514004013/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110604113129/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110622041235/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110808134322/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110831045215/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110902061301/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110923195445/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20110924184425/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20111007181226/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20111008055552/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20111022053249/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20111103062523/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20111117052651/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20111209124632/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20120104161529/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20120212181744/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20120427110145/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20120501062039/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20121003055408/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20121004011734/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20121111152853/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20130114153030/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20130123023410/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20130428150032/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20130807194928/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20130922033904/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20131014020500/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20131101114213/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20140209142944/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20140625144720/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20140924085118/http://www.baseball-reference.com/friv/ratings.cgi'
        ,'/web/20141007121447/http://www.baseball-reference.com/friv/ratings.cgi'
        ]




#########################
def stripData(ll):
    ibatter = 1
    data = []
    for l in ll:
        print '*********************'
        if ('h2' in l) and ('Pitcher' in l):
            ibatter = 0
        st = l.split('\n')
#        print l, st
        ibegin = False
        ans = []
        for s in st:
            if '<tr  class=' in s:
                ibegin = True
                continue
            if not ibegin:
                continue
            m = re.search('>(.+)<', s)
            if ('AM' in s) or ('PM' in s):
                ans.append(ibatter)
                data.append(ans)
                print ibatter
                continue
            if m:
                v = m.group(1)
                if 'href' in v:
                    tmp = v.split('>')[1].split('<')[0]
                    v = ''.join(tmp.split())                    
                print v,
                ans.append(v)
    return data

##########################
def makeData():

    ofile = 'eloRatings.dat'
    ofp = open(ofile,'w')
    q0 = datetime.date(2011, 1, 1)

    for uu in urls:

        q = uu.split('/')[2]
        yr = int(q[0:4])
        mn = int(q[4:6])
        dd = int(q[6:8])
        q1 = datetime.date(yr, mn, dd)
        url = 'http://web.archive.org' + uu
        u = urllib2.urlopen(url)

        ifile = 'eloWayback_%04d%02d%04d.html' % (yr, mn, dd)
        if os.path.exists(ifile):
            ll = open(ifile).read().split('</tr>')
        else:
            ll = u.read()
            qfp = open(ifile,'w')
            for l in ll:
                qfp.write('%s' % l)
            qfp.close()
            ll = ll.split('</tr>')

        data = stripData(ll)
        print data, yr, mn, dd, (q1-q0).days

        for vv in data:
            if len(vv)==8:
                for v in vv:
                    ofp.write('%s ' % v)
        
                ofp.write('%d %d %d %d \n ' % (yr, mn, dd, (q1-q0).days)) 
    ofp.close()

##########################
def readData(ifile):
    dt = pylab.dtype([('eloRank','i4'), 
                      ('name','S128'), 
                      ('eloRating', 'i4'), 
                      ('eloGames', 'i4'), 
                      ('eloW', 'i4'), ('eloL', 'i4'), ('wpct', 'f8'), 
                      ('iBatter', 'i4'), 
                      ('yr', 'i4'), ('mn', 'i4'), ('day', 'i4'), 
                      ('dt', 'i4')])
    q = pylab.genfromtxt(ifile, dtype=dt)

    return q

##########################
if __name__=='__main__':
    imake = False
    for ia, a in enumerate(sys.argv):
        if a=='-imake':
            imake = True

    if imake:
        makeData()

    q = readData('eloRatings.dat')
#    print q 
    names = pylab.unique(q['name'])
    for name in names:
        cut = pylab.where(q['name']==name)
        r = q[cut]['eloRank']
        m = pylab.mean(r)
        s = pylab.std(r)
        n = len(r)
        if n>=20:
            print name, m, s, n
