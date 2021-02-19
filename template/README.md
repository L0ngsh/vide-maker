## Template Folder

## Warnig

    Needed changes on template script to locate all files to the video

    ```xml
    <mlt LC_NUMERIC="C" producer="main_bin" version="6.25.0" root="PATH/template/1">
     <profile frame_rate_num="25" sample_aspect_num="1" display_aspect_den="9" colorspace="709" progressive="1" description="HD 1080p 25 fps" display_aspect_num="16" frame_rate_den="1" width="1920" height="1080" sample_aspect_den="1"/>
     <consumer f="mp4" g="15" channels="2" crf="23" progressive="1" target="/home/l0ng/Projects/test/content/template1.mp4" threads="0" real_time="-3" mlt_service="avformat" vcodec="libx264" ab="192k" movflags="+faststart" bf="2" preset="faster" acodec="aac" in="0" out="1050"/>
     <producer id="producer6" in="00:00:00.000" out="00:00:06.960">
      <property name="length">175</property>
      <property name="eof">pause</property>
      <property name="resource">PATH/content/0-converted.png</property>
      <property name="ttl">25</property>
      <property name="aspect_ratio">1</property>
      <property name="progressive">1</property>
      <property name="seekable">1</property>
      <property name="meta.media.width">1920</property>
      <property name="meta.media.height">1080</property>
      <property name="mlt_service">qimage</property>
      <property name="kdenlive:clipname"/>
      <property name="kdenlive:duration">00:00:05.000</property>
      <property name="kdenlive:folderid">-1</property>
      <property name="kdenlive:id">2</property>
      <property name="kdenlive:file_size">1378980</property>
      <property name="kdenlive:file_hash">8ac273e32eaa24019df05f9844cf0809</property>
      <property name="global_feed">1</property>
     </producer>

    [...]
    ```

# 1,2,3...

    Folder to musics and template file for kdenlive

    Write the musics creds in the music.link file as you wish, leave in blank if you dont have a music.

# scripts

    Folder to put all templates scripts